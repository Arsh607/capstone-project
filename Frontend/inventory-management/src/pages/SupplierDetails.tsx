import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../api/supplierApi";

import type { SupplierInput } from "../api/supplierApi";

function SupplierDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SupplierInput>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const loadSupplier = async () => {
      if (!id) return;

      try {
        setError("");

        const response = await getSupplierById(id);
        const supplier = response.data;

        setFormData({
          name: supplier.name,
          email: supplier.email,
          phoneNumber: supplier.phoneNumber,
          address: supplier.address,
        });
      } catch (error) {
        console.error("Failed to load supplier:", error);

        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ||
              "Failed to load supplier."
          );
        } else {
          setError("Failed to load supplier.");
        }
      }
    };

    loadSupplier();
  }, [id]);

  const handleUpdate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!id) return;

    try {
      setError("");

      await updateSupplier(id, formData);

      navigate("/suppliers");
    } catch (error) {
      console.error("Failed to update supplier:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Failed to update supplier."
        );
      } else {
        setError("Failed to update supplier.");
      }
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      setError("");

      await deleteSupplier(id);

      navigate("/suppliers");
    } catch (error) {
      console.error("Failed to delete supplier:", error);

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
      <h1 style={{ color: "cyan" }}>
        Supplier Details
      </h1>

      <button
        onClick={() => navigate("/suppliers")}
      >
        Back
      </button>

      {error && (
        <p
          style={{
            color: "white",
            marginTop: "20px",
            fontWeight: "bold",
          }}
        >
          {error}
        </p>
      )}

      <form
        onSubmit={handleUpdate}
        style={{
          marginTop: "25px",
          display: "grid",
          gap: "12px",
          width: "350px",
        }}
      >
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
          Update Supplier
        </button>
      </form>

      <button
        onClick={handleDelete}
        style={{
          marginTop: "50px",
          background: "red",
        }}
      >
        Delete Supplier
      </button>
    </main>
  );
}

export default SupplierDetails;