import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Create() {
  // ... all the useState, functions, and other code ...

  return (
    <div>
      <h3>Crear cliente individual</h3>
      <form onSubmit={onSubmit}>
        {/* ... individual form fields ... */}
        <div className="form-group">
          <input type="submit" value="Create Individual Client" className="btn btn-primary" disabled={clientFound.length > 0} />
        </div>
      </form>
    </div>
  );
}

