const ConciergeEdit = ({ edits, activeEditId, onSelect, onAskAssistant }) => {
  return (
    <section className="concierge-edit glass" aria-labelledby="concierge-edit-title">
      <div className="concierge-copy">
        <p className="eyebrow">Concierge Edit</p>
        <h2 id="concierge-edit-title">Shop by moment, not only by category.</h2>
        <p>
          Each edit narrows the collection for a specific occasion and can hand the
          same context directly to the assistant.
        </p>
      </div>

      <div className="concierge-grid" role="list" aria-label="Shopping moments">
        {edits.map((edit) => {
          const isActive = edit.id === activeEditId

          return (
            <article
              key={edit.id}
              className={`concierge-card ${isActive ? 'active' : ''}`}
              role="listitem"
            >
              <p className="concierge-kicker">{edit.kicker}</p>
              <h3>{edit.title}</h3>
              <p className="concierge-description">{edit.description}</p>
              <p className="concierge-products">{edit.highlight}</p>
              <div className="concierge-actions">
                <button
                  type="button"
                  className={`concierge-select ${isActive ? 'active' : ''}`}
                  onClick={() => onSelect(edit.id)}
                  aria-pressed={isActive}
                >
                  {isActive ? 'Active Edit' : 'View Edit'}
                </button>
                <button
                  type="button"
                  className="concierge-link"
                  onClick={() => onAskAssistant(edit)}
                >
                  Ask Assistant
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ConciergeEdit
