import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axiosInstance from "../services/axiosInstance";

const UserDataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const email = localStorage.getItem("email");

  const API_URL = "http://127.0.0.1:8000/users/api/";

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const fetchData = () => {
    axiosInstance
      .get(API_URL)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = () => {
    if(window.confirm("¿Estás seguro que deseas actualizar este usuario?")){
      axiosInstance
      .put(`${API_URL}${selectedUser.id}/`, selectedUser)
      .then(() => {
        fetchData();
        closeModal();
        alert("Usuario actualizado con éxito ✨");
      })
      .catch((error) => {
        console.error("Error al actualizar usuario:", error);
        alert("Hubo un error al actualizar");
      });
    }    
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro que deseas eliminar este usuario?")) {
      axiosInstance
        .delete(`${API_URL}${id}/`)
        .then(() => {
          fetchData();
          alert("Usuario eliminado correctamente 🗑️");
        })
        .catch((error) => {
          console.error("Error al eliminar:", error);
          alert("No se pudo eliminar el usuario");
        });
    }
  };

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Teléfono",
      selector: (row) => row.tel,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <span>
          <button className="btn btn-warning me-2" onClick={() => openModal(row)}>
            <i className="bi bi-pencil"></i>
          </button>
          {email.trim() !== row.email.trim() ? (
            <button className="btn btn-danger" onClick={() => handleDelete(row.id)}>
              <i className="bi bi-trash"></i><br />
            </button>
          ) : (<></>)}
          
        </span>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <h3>Tabla de usuarios</h3>
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        highlightOnHover
        pointerOnHover
      />

      {showModal && selectedUser && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Usuario</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Nombre:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedUser.name}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Apellido:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedUser.surname}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, surname: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      value={selectedUser.email}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Teléfono:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedUser.tel}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, tel: e.target.value })
                      }
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDataTable;
