
resource "aws_s3_bucket" "timeseries_bucket" {
  acl = "private"
  bucket = "${var.files_bucket_name}"
}
