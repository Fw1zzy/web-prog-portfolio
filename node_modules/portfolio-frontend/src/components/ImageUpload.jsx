function ImageUpload({ label, image, onImageChange, disabled }) {
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        onImageChange(reader.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="image-upload-card">
      <p className="image-upload-label">{label}</p>
      <div className="avatar-preview">
        <img
          src={image || "/assets/images/avatar-1.png"}
          alt="Profile preview"
          className="avatar-image"
          onError={(e) => {
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEMzMCAyNy40IDI3LjQgMjUgMjUgMjVDMjIuNiAyNSAyMCAyNy40IDIwIDMwVjQwQzIwIDQyLjIgMjEuOCAzNCAyNSAzNEgzNUMzNy4yIDM0IDQwIDQyLjIgNDAgNDBWMzBaIiBmaWxsPSIjOUI5QkE0Ii8+CjxjaXJjbGUgY3g9IjM1IiBjeT0iMzUiIHI9IjMiIGZpbGw9IiM5QjlCQTQiLz4KPGRpcmNsZSBjeD0iNDUiIGN5PSIzNSIgcj0iMyIgZmlsbD0iIzlCOUI5NCIvPgo8L3N2Zz4K";
          }}
        />
      </div>
      <input
        type="file"
        accept="image/*"
        className="form-input"
        onChange={handleFileSelect}
        disabled={disabled}
      />
    </div>
  );
}

export default ImageUpload;
