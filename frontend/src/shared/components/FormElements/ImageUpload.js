import React, { useRef, useState, useEffect } from "react";
import Button from "./Button";
import "./ImageUpload.css";
const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const filePickerRef = useRef();
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = true;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);
  return (
    <>
      <div className="form-control">
        <input
          id={props.id}
          ref={filePickerRef}
          style={{ display: "none" }}
          type="file"
          accept=".jpg, .png, .jpeg"
          onChange={pickedHandler}
        />
        <div className={`image-upload ${props.center && "center"}`}>
          <div className={"image-upload__preview"}>
            {previewUrl && <img src={previewUrl} alt="Preview"></img>}
            {!previewUrl && <p>Please pick an image.</p>}
          </div>
          <div className={"image-upload__button-div"}>
            <div className={"image-upload__button"}>
              <Button  type="button" onClick={pickImageHandler}>
                Upload image
              </Button>
            </div>
          </div>
        </div>
        {!isValid && <p>{props.errorText}</p>}
      </div>
    </>
  );
};

export default ImageUpload;
