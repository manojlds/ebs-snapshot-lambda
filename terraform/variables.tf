variable "max_retries" {
  default = "100"
}
variable "aws_region" {
  default = "us-east-1"
}
variable "lamba_schedue" {
  default = "1 day"
}
variable "lambda_source_dir" {
  default = "../lambda"
}

variable "lambda_prepared_source_dir" {
  default = "../lambda"
}

variable "lambda_archive_path" {
  default = "../dist/ebs_snapshot_lambda.zip"
}
