import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "../api/productApi";
import type { ProductInput } from "../api/productApi";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProductInput>({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "Electronics",
    supplierId: "",
  });

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        const response = await getProductById(id);
        const product = response.data;

        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          category: product.category,
          supplierId: product.supplierId,
        });
      } catch (error) {
        console.error("Failed to load product:", error);
      }
    };

    loadProduct();
  }, [id]);

  const handleUpdate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!id) return;

    try {
      await updateProduct(id, formData);
      navigate("/inventory");
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteProduct(id);
      navigate("/inventory");
    } catch (error) {
      console.error("Failed to delete product:", error);
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
      <h1 style={{ color: "cyan" }}>Product Details</h1>

      <button onClick={() => navigate("/inventory")}>
        Back
      </button>

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
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />

        <input
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
        />

        <input
          type="number"
          value={formData.price}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: Number(e.target.value),
            })
          }
        />

        <input
          type="number"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({
              ...formData,
              quantity: Number(e.target.value),
            })
          }
        />

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

        <input
          value={formData.supplierId}
          onChange={(e) =>
            setFormData({
              ...formData,
              supplierId: e.target.value,
            })
          }
        />

        <button type="submit">
          Update Product
        </button>
      </form>

      <button
        onClick={handleDelete}
        style={{
          marginTop: "50px",
          background: "red",
        }}
      >
        Delete Product
      </button>
    </main>
  );
}

export default ProductDetails;