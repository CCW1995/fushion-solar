export const textareaDisplayContent = val =>  {
  return val.split('\n').map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ))
}