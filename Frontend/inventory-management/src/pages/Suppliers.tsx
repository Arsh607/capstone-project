import { useEffect, useState } from "react";
import axios from "axios";
import {
  getSuppliers,
  createSupplier,
  deleteSupplier,
} from "../api/supplierApi";
import { useNavigate } from "react-router-dom";
import type { SupplierInput } from "../api/supplierApi";

function Suppliers() {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<SupplierInput>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSuppliers();
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error loading suppliers:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Failed to load suppliers."
        );
      } else {
        setError("Failed to load suppliers.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleCreate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setError("");

      await createSupplier(formData);

      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
      });

      await loadSuppliers();
    } catch (error) {
      console.error("Error creating supplier:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Failed to create supplier."
        );
      } else {
        setError("Failed to create supplier.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError("");

      await deleteSupplier(id);
      await loadSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Failed to delete supplier."
        );
      } else {
        setError("Failed to delete supplier.");
      }
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "grey",
        color: "white",
        padding: "30px",
      }}
    >
      <h1 style={{ color: "cyan" }}>Suppliers</h1>

      <button onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

      {error && (
        <p
          style={{
            color: "red",
            marginTop: "20px",
            fontWeight: "bold",
          }}
        >
          {error}
        </p>
      )}

      <form onSubmit={handleCreate}>
        <input
          placeholder="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
        />

        <input
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({
              ...formData,
              phoneNumber: e.target.value,
            })
          }
        />

        <input
          placeholder="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: e.target.value,
            })
          }
        />

        <button type="submit">
          Add Supplier
        </button>
      </form>

      {loading ? (
        <p>Loading suppliers...</p>
      ) : (
        <table
          border={1}
          cellPadding={10}
          style={{ marginTop: "30px" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.id}</td>
                <td>{supplier.name}</td>
                <td>{supplier.email}</td>
                <td>{supplier.phoneNumber}</td>
                <td>{supplier.address}</td>

                <td>
                  <button
                    onClick={() =>
                      navigate(`/suppliers/${supplier.id}`)
                    }
                  >
                    View / Update
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(supplier.id)
                    }
                    style={{
                      marginLeft: "10px",
                      background: "red",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

export default Suppliers;