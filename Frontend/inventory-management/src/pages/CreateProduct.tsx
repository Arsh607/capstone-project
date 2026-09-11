import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createProduct } from "../api/productApi";
import type { CreateProductInput } from "../api/productApi";

function CreateProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateProductInput>({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "Electronics",
    supplierId: "",
  });

  const [error, setError] = useState("");

  const handleCreate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setError("");

      await createProduct({
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      });

      navigate("/inventory");
    } catch (error) {
      console.error("Failed to create product:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Failed to create product."
        );
      } else {
        setError("Failed to create product.");
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
      <h1 style={{ color: "cyan" }}>Create Product</h1>

      <button onClick={() => navigate("/inventory")}>
        Back
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

      <form
        onSubmit={handleCreate}
        style={{
          marginTop: "25px",
          display: "grid",
          gap: "12px",
          width: "350px",
        }}
      >
        <label>Name</label>

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

        <label>Description</label>

        <input
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
        />

        <label>Price</label>

        <input
          type="number"
          placeholder="0"
          value={formData.price}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: e.target.value,
            })
          }
        />

        <label>Quantity</label>

        <input
          type="number"
          placeholder="0"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({
              ...formData,
              quantity: e.target.value,
            })
          }
        />

        <label>Category</label>

        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value,
            })
          }
        >
          <option>Electronics</option>
          <option>Office Supplies</option>
          <option>Furniture</option>
          <option>Food</option>
          <option>Home Supplies</option>
        </select>

        <label>Supplier ID</label>

        <input
          placeholder="Supplier ID e.g. supp_1"
          value={formData.supplierId}
          onChange={(e) =>
            setFormData({
              ...formData,
              supplierId: e.target.value,
            })
          }
        />

        <button type="submit">
          Create Product
        </button>
      </form>
    </main>
  );
}

export default CreateProduct;