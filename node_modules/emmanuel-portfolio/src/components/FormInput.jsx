function FormInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  required = false,
  name,
}) {
  return (
    <div className="input-wrapper">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        name={name || id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="form-input"
      />
    </div>
  );
}

export default FormInput;
