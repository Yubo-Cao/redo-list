use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Error {
    message: String,
}

impl From<sled::Error> for Error {
    fn from(error: sled::Error) -> Self {
        Error {
            message: error.to_string(),
        }
    }
}

impl From<regex::Error> for Error {
    fn from(error: regex::Error) -> Self {
        Error {
            message: error.to_string(),
        }
    }
}

impl From<serde_json::Error> for Error {
    fn from(error: serde_json::Error) -> Self {
        Error {
            message: error.to_string(),
        }
    }
}

impl From<tokio::task::JoinError> for Error {
    fn from(error: tokio::task::JoinError) -> Self {
        Error {
            message: error.to_string(),
        }
    }
}


impl From<image::ImageError> for Error {
    fn from(error: image::ImageError) -> Self {
        Error {
            message: error.to_string(),
        }
    }
}

impl From<std::io::Error> for Error {
    fn from(error: std::io::Error) -> Self {
        Error {
            message: error.to_string(),
        }
    }
}
