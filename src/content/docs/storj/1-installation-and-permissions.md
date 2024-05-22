---
title: Installation, Permissions & Usage
description: A reference page in my new Starlight docs site.
---
Traditional cloud data storage services are more expensive than decentralized data storage services. EinarCLI allows you to install StorJ Uplink, an innovative solution for decentralized data storage that offers significantly lower costs and greater security.

## 🚀 StorJ Uplink Installation
Inside your project directory, run the following command to include StorJ Uplink in your project:
```sh
einar install uplink
```
This will generate the following files and directories within your project, setting up the necessary infrastructure for StorJ Uplink interaction:

```sh 
/app
  /shared
    /infrastructure
      /storj
        - uplink.go
```
## 🔒 Permissions Setup
The Uplink installation requires an Access Grant as an input parameter. The Access Grant can be obtained from the Satellite UI. [See the Storj documentation for more details](https://docs.storj.io/learn/tutorials/quickstart-uplink-cli/uploading-your-first-object/create-first-access-grant).

Before generating your Access Grant, verify that the .env file in the root of your project contains the `STORJ_ACCESS_GRANT` environment variable:

```sh
STORJ_ACCESS_GRANT="replace-by-your-generated-access-grant"
```

## 🪣 Generate a New Custom Bucket
Inside your project directory, run the following command to create a new custom bucket:
```sh 
einar generate uplink-bucket customer-contract-bucket
```
Here's an example of how the generated code might look:

```sh 
type CustomerContractBucket struct {
	fileExpiration  time.Duration
	sharedLinkCreds *edge.Credentials
	bucketName      string
	upLink          *storj.Uplink
}

func init() {
	ioc.Registry(
		NewCustomerContractBucket,
		storj.NewUplink)
}

func NewCustomerContractBucket(ul *storj.Uplink) (storj.UplinkManager, error) {
	sharedLinkExpiration := 2 * time.Minute
	fileExpiration := 7 * 24 * time.Hour
	bucketName := "customer-contract-bucket"
	bucketFolderName := ""
	sharedLinkRestrictedAccess, err := ul.Access.Share(
		uplink.Permission{
			// only allow downloads
			AllowDownload: true,
			// this allows to automatically cleanup the access grants
			NotAfter: time.Now().Add(sharedLinkExpiration),
		}, uplink.SharePrefix{
			Bucket: bucketName,
			Prefix: bucketFolderName,
		},
	)
	if err != nil {
		return CustomerContractBucket{}, fmt.Errorf("could not restrict access grant: %w", err)
	}

	// RegisterAccess registers the credentials to the linksharing and s3 sites.
	// This makes the data publicly accessible, see the security implications in https://docs.storj.io/dcs/concepts/access/access-management-at-the-edge.
	ctx := context.Background()
	credentials, err := ul.Config.RegisterAccess(ctx,
		sharedLinkRestrictedAccess,
		&edge.RegisterAccessOptions{Public: true})
	if err != nil {
		return CustomerContractBucket{}, fmt.Errorf("could not register access: %w", err)
	}
	// Create Bucket
	_, err = ul.Project.CreateBucket(ctx, bucketName)
	if err != nil && !errors.Is(err, uplink.ErrBucketAlreadyExists) {
		return CustomerContractBucket{}, fmt.Errorf("error creating bucket: %w", err)
	}

	// Ensure the desired Bucket within the Project is created.
	_, err = ul.Project.EnsureBucket(ctx, bucketName)
	if err != nil {
		return CustomerContractBucket{}, fmt.Errorf("could not ensure bucket: %v", err)
	}

	bucket := CustomerContractBucket{
		fileExpiration:  fileExpiration,
		sharedLinkCreds: credentials,
		bucketName:      bucketName,
		upLink:          ul,
	}
	return bucket, nil
}

func (b CustomerContractBucket) CreatePublicSharedLink(ctx context.Context, objectKey string) (string, error) {
	_, span := observability.Tracer.Start(ctx,
		"NewCustomerContractBucketCreatePublicSharedLink",
		trace.WithSpanKind(trace.SpanKindInternal))
	defer span.End()
	// Create a public link that is served by linksharing service.
	url, err := edge.JoinShareURL("https://link.storjshare.io",
		b.sharedLinkCreds.AccessKeyID,
		b.bucketName, objectKey, nil)
	if err != nil {
		span.RecordError(err)
		return "", fmt.Errorf("could not create a shared link: %w", err)
	}
	return url, nil
}

func (b CustomerContractBucket) Upload(ctx context.Context, objectKey string, dataToUpload []byte) error {
	// Intitiate the upload of our Object to the specified bucket and key.
	upload, err := b.upLink.Project.UploadObject(ctx, b.bucketName, objectKey, &uplink.UploadOptions{
		// It's possible to set an expiration date for data.
		Expires: time.Now().Add(b.fileExpiration),
	})
	if err != nil {
		return fmt.Errorf("could not initiate upload: %v", err)
	}
	// Copy the data to the upload.
	buf := bytes.NewBuffer(dataToUpload)
	_, err = io.Copy(upload, buf)
	if err != nil {
		_ = upload.Abort()
		return fmt.Errorf("could not upload data: %v", err)
	}

	// Commit the uploaded object.
	err = upload.Commit()
	if err != nil {
		return fmt.Errorf("could not commit uploaded object: %v", err)
	}
	return nil
}
```
The file `customer_contract_bucket.go` will be created in the following directory structure:
```
/app
  /adapter
    /out
      /bucket
        - customer_contract_bucket.go  
```