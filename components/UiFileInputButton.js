import { useRef } from 'react'
import { BsUpload } from 'react-icons'
export const UiFileInputButton = (props) => {
  const fileInputRef = useRef(null)
  const formRef = useRef(null)

  const onClickHandler = () => {
    fileInputRef.current?.click()
  }

  const onChangeHandler = (event) => {
    if (!event.target.files?.length) {
      return
    }

    const formData = new FormData()

    Array.from(event.target.files).forEach((file) => {
      if (props.formData) {
        props.formData.append(event.target.name, file)
        props.onChange(props.formData)
      } else {
        formData.append(event.target.name, file)
        props.onChange(formData)
      }
    })
  }

  return (
    <form className="border-primary/20 rounded border p-2" ref={formRef}>
      <button type="button" onClick={onClickHandler}>
        {props.label}
      </button>
      <input
        accept={props.acceptedFileTypes}
        multiple={props.allowMultipleFiles}
        name={props.uploadFileName}
        onChange={onChangeHandler}
        ref={fileInputRef}
        type="file"
      />
    </form>
  )
}

UiFileInputButton.defaultProps = {
  acceptedFileTypes: '',
  allowMultipleFiles: false,
}
