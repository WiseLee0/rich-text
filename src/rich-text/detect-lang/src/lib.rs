extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;
use whatlang::{Detector, Lang};

/// 检测文本语言类型
#[wasm_bindgen]
pub fn detect_text(text: String) -> String {
    let allowlist = vec![Lang::Eng, Lang::Cmn, Lang::Jpn, Lang::Kor, Lang::Hin, Lang::Tha];
    let detector = Detector::with_allowlist(allowlist);
    let lang = detector.detect_lang(&text);
    match lang {
        Some(value) => value.eng_name().to_string(),
        None => "None".to_string(),
    }
}

#[test]
fn test_detect_text() {
    // let text = "हैलो वर्ल्ड";
    let text = "สวัสดีโลก";
    let info = detect_text(text.to_string());
    print!("{:?}", info);
}
