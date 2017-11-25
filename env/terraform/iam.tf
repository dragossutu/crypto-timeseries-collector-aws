
resource "aws_iam_role" "lambda_role" {
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

  description = "Allows lambda to put files in S3 buckets and log to Cloudwatch."
  name = "lambda.s3.writer"
}

resource "aws_iam_role_policy_attachment" "lambda_role_s3_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
  role = "${aws_iam_role.lambda_role.name}"
}

resource "aws_iam_role_policy_attachment" "lambda_role_logging_policy" {
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
  role = "${aws_iam_role.lambda_role.name}"
}
