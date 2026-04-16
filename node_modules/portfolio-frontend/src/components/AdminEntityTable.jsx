function AdminEntityTable({
  title,
  subtitle,
  columns,
  rows,
  onEdit,
  onDelete,
  onView,
  emptyLabel = "No records available",
}) {
  return (
    <section className="admin-table-card">
      <div className="admin-table-header">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.title}</th>
              ))}
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="empty-row" colSpan={columns.length + 1}>
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row._id}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render
                        ? column.render(row)
                        : (row[column.key] ?? "-")}
                    </td>
                  ))}
                  <td className="actions-column">
                     {onView && (
                       <button
                         className="button button-view"
                         onClick={() => onView(row)}
                       >
                         View
                       </button>
                     )}
                     {onEdit && (
                       <button
                         className="button button-secondary"
                         onClick={() => onEdit(row)}
                       >
                         Edit
                       </button>
                     )}
                     {onDelete && (
                       <button
                         className="button button-danger"
                         onClick={() => onDelete(row)}
                       >
                         Delete
                       </button>
                     )}
                   </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminEntityTable;
