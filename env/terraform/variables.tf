
variable "currency_pair" {
  default = "XBTEUR"
}

variable "files_bucket_name" {
  default = "timeseries.crypto.sutu.io"
}

variable "lambda_filename" {
  default = "../../dist/lambda.zip"
}

variable "lambda_function_name" {
  default = "kraken-timeseries-collector"
}

variable "lambda_handler" {
  default = "index.handler"
}

variable "lambda_runtime" {
  default = "nodejs6.10"
}

variable "lambda_timeout" {
  default = 30
}
