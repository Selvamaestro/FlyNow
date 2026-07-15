import "./CategoryManagement.css";

import { useEffect, useState } from "react";
import {
  getCategories,
  addCategory,
  editCategory,
  deleteCategory,
} from "../../services/categoryService";
const CategoryManagement = () => {

const [categories,setCategories]=useState([]);
const [showModal, setShowModal] = useState(false);
const [isEditing, setIsEditing] = useState(false);

const [selectedCategoryId, setSelectedCategoryId] = useState(null);

const [newCategory, setNewCategory] = useState({
  name: "",
  color: "",
  offerCount: "",
  icon: "",
  description: "",
  status: "Active",
});

useEffect(()=>{

loadCategories();

},[]);

const loadCategories = async () => {
  const data = await getCategories();

  data.forEach((category, index) => {
    console.log("Category", index + 1, category);
  });

  setCategories(data);
};
const handleEditClick = (category) => {

  setIsEditing(true);

  setSelectedCategoryId(category.id);

  setNewCategory({
    name: category.name,
    color: category.color,
    offerCount: category.offerCount,
    icon: category.icon,
    description: category.description,
    status: category.status || "Active",
  });

  setShowModal(true);

};
const handleSaveCategory = async () => {

  if (
    !newCategory.name ||
    !newCategory.color ||
    !newCategory.offerCount
  ) {
    alert("Please fill all required fields.");
    return;
  }

  try {

    if (isEditing) {

      await editCategory(
        selectedCategoryId,
        newCategory
      );

      alert("Category updated successfully!");

    } else {

      await addCategory(newCategory);

      alert("Category added successfully!");

    }

    await loadCategories();

    setShowModal(false);

    setIsEditing(false);

    setSelectedCategoryId(null);

    setNewCategory({
      name: "",
      color: "",
      offerCount: "",
      icon: "",
      description: "",
      status: "Active",
    });

  } catch (error) {

    console.error(error);

    alert("Something went wrong.");

  }

};
const handleDeleteCategory = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this category?"
  );

  if (!confirmDelete) return;

  try {

    await deleteCategory(id);

    await loadCategories();

    alert("Category deleted successfully!");

  } catch (error) {

    console.error(error);

    alert("Failed to delete category.");

  }

};

  return (

    <div className="category-management">

      <div className="category-header">

        <div>

          <h2>Category Management</h2>

          <p>Manage all shopping categories</p>

        </div>

<button
  className="add-btn"
  onClick={() => setShowModal(true)}
>
          + Add Category

        </button>

      </div>

<div className="category-table">

<div className="table-head">

<span>Name</span>

<span>Color</span>

<span>Offers</span>

<span>Actions</span>

</div>

{

categories.map(category=>(

<div
className="table-row"
key={category.id}
>

<div>

{category.name}

</div>

<div>

<div>
  {category.color}
</div>

</div>

<div>
  {String(category.offerCount)}
</div>

<div>

<button
  onClick={() => handleEditClick(category)}
>
  Edit
</button>
<button
  onClick={() => handleDeleteCategory(category.id)}
>
  Delete
</button>
</div>

</div>

))

}

</div>
{showModal && (

<div className="modal-overlay">

  <div className="category-modal">

    <h2>Add New Category</h2>

    <input
      type="text"
      placeholder="Category Name"
      value={newCategory.name}
      onChange={(e) =>
        setNewCategory({
          ...newCategory,
          name: e.target.value,
        })
      }
    />

    <input
      type="color"
      value={newCategory.color}
      onChange={(e) =>
        setNewCategory({
          ...newCategory,
          color: e.target.value,
        })
      }
    />

    <input
      type="number"
      placeholder="Offer Count"
      value={newCategory.offerCount}
      onChange={(e) =>
        setNewCategory({
          ...newCategory,
          offerCount: Number(e.target.value),
        })
      }
    />

    <input
      type="text"
      placeholder="Icon"
      value={newCategory.icon}
      onChange={(e) =>
        setNewCategory({
          ...newCategory,
          icon: e.target.value,
        })
      }
    />

    <textarea
      placeholder="Description"
      value={newCategory.description}
      onChange={(e) =>
        setNewCategory({
          ...newCategory,
          description: e.target.value,
        })
      }
    />

    <select
      value={newCategory.status}
      onChange={(e) =>
        setNewCategory({
          ...newCategory,
          status: e.target.value,
        })
      }
    >
      <option>Active</option>
      <option>Inactive</option>
    </select>

    <div className="modal-buttons">

      <button
        className="cancel-btn"
        onClick={() => setShowModal(false)}
      >
        Cancel
      </button>

      <button
        className="save-btn"
onClick={handleSaveCategory}      >
{isEditing ? "Update Category" : "Save Category"}      </button>

    </div>

  </div>

</div>

)}
    </div>

  );

};

export default CategoryManagement;