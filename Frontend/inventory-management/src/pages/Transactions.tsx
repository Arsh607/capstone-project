import { useEffect, useState } from "react";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from "../api/transactionApi";
import type { TransactionInput } from "../api/transactionApi";
import { useNavigate } from "react-router-dom";

function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<TransactionInput>({
    productId: "",
    quantityChanged: 1,
    type: "add",
    notes: "",
  });

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.log("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await createTransaction(formData);

    setFormData({
      productId: "",
      quantityChanged: 1,
      type: "add",
      notes: "",
    });

    loadTransactions();
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
    loadTransactions();
  };

  return (
    <main style={{ minHeight: "100vh", background: "grey", color: "white", padding: "30px" }}>
      <h1 style={{ color: "cyan" }}>Transactions</h1>
      <button onClick={() => navigate("/dashboard")}>Back To Dashboard</button>

      <form onSubmit={handleCreate}>
        <input
          placeholder="Product ID e.g. prod_1"
          value={formData.productId}
          onChange={(e) =>
            setFormData({ ...formData, productId: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Quantity Changed"
          value={formData.quantityChanged}
          onChange={(e) =>
            setFormData({
              ...formData,
              quantityChanged: Number(e.target.value),
            })
          }
        />

        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as "add" | "remove" | "adjust",
            })
          }
        >
          <option value="add">add</option>
          <option value="remove">remove</option>
          <option value="adjust">adjust</option>
        </select>

        <input
          placeholder="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />

        <button type="submit">Add Transaction</button>
      </form>

      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <table border={1} cellPadding={10} style={{ marginTop: "30px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product ID</th>
              <th>Type</th>
              <th>Quantity Changed</th>
              <th>Created At</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.productId}</td>
                <td>{transaction.type}</td>
                <td>{transaction.quantityChanged}</td>
                <td>{transaction.createdAt}</td>
                <td>{transaction.notes || "N/A"}</td>
                <td>
                  <button onClick={() => handleDelete(transaction.id)}>
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

export default Transactions;