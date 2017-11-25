
resource "aws_lambda_function" "kraken_timeseries_collector" {
  filename = "${var.lambda_filename}"
  function_name = "${var.lambda_function_name}"
  handler = "${var.lambda_handler}"
  role = "${aws_iam_role.lambda_role.arn}"
  runtime = "${var.lambda_runtime}"
  timeout = "${var.lambda_timeout}"

  environment = {
    variables = {
      S3_BUCKET = "${aws_s3_bucket.timeseries_bucket.id}"
      CURRENCY_PAIR = "${var.currency_pair}"
    }
  }
}
