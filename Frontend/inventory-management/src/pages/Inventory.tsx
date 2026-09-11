import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getProducts,
  getProductById,
} from "../api/productApi";

function Inventory() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts();

      setProducts(response.data);
    } catch (error) {
      console.error("Product loading error:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Failed to load products."
        );
      } else {
        setError("Failed to load products.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setError("");

      if (!searchId.trim()) {
        setError("Please enter a product ID.");
        return;
      }

      await getProductById(searchId.trim());

      navigate(`/inventory/${searchId.trim()}`);
    } catch (error) {
      console.error("Product search error:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Product not found."
        );
      } else {
        setError("Product not found.");
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
      <h1 style={{ color: "cyan" }}>Inventory</h1>

      <button
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>

      <section style={{ marginTop: "25px" }}>
        <button
          onClick={() =>
            navigate("/inventory/create")
          }
        >
          Create New Product
        </button>
      </section>

      <form
        onSubmit={handleSearch}
        style={{ marginTop: "25px" }}
      >
        <input
          placeholder="Search product by ID e.g. prod_1"
          value={searchId}
          onChange={(e) =>
            setSearchId(e.target.value)
          }
        />

        <button type="submit">
          Search
        </button>
      </form>

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

      <h2
        style={{
          color: "cyan",
          marginTop: "30px",
        }}
      >
        Existing Products
      </h2>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <table
          border={1}
          cellPadding={10}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Supplier</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                onClick={() =>
                  navigate(
                    `/inventory/${product.id}`
                  )
                }
                style={{
                  cursor: "pointer",
                }}
              >
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.supplierId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

export default Inventory;