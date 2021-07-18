import React, { useEffect, useState } from "react";
import { MDBDataTableV5 } from "mdbreact";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
var initialValues = {
  name: "",

  email: "",
  phone: "",
  date: "",
  designation: "",
};
const validationSchema = Yup.object({
  name: Yup.string().required("This field is required"),
  email: Yup.string().email().required("Email is required"),
  phone: Yup.number()
    .required("This field is required")
    .min(10, "enter 10 numbers"),
  designation: Yup.string().required("This field is required"),
  date: Yup.date().required("Enter valid date"),
});
const schema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required("Email is required"),
  phone: Yup.number()
    .required("This field is required")
    .min(10, "enter 10 numbers"),
  designation: Yup.string().required("This field is required"),
  date: Yup.date().required("Enter valid date"),
});
export default function SelectSearchTopReverse() {
  const [show, setShow] = useState(false);
  const [editForm, setEditFormData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema)
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  function onSubmit(formData) {
    console.log(formData);
    axios
      .post("http://localhost:8000/api/v1/contacts/submit-contact", formData)
      .then((response) => {
        setDatatable({ ...datatable, rows: [...datatable.rows, formData] });
        alert("Success");
        setShow(false);
        setRefresh(refresh ? false : true);
      })
      .catch((err) => {
        alert("Error");
      });
  }
  const [edit, setEdit] = useState({ status: false, id: "" });
  const [datatable, setDatatable] = React.useState({
    columns: [
      {
        label: "Name",
        field: "name",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: "Email",
        field: "email",
        width: 270,
      },
      {
        label: "Phone",
        field: "phone",
        width: 200,
      },

      {
        label: "Start date",
        field: "date",
        sort: "disabled",
        width: 150,
      },
      {
        label: "Action",
        field: "action",
        sort: "disabled",
        width: 100,
      },
    ],
    rows: [],
  });
  const action = (id, data) => {
    setShow(true);
    setEditFormData({
      ...editForm,
      id: id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      designation: data.designation,
      date: data.date,
    });
    setEdit({
      status: true,
      id: id,
      data: data,
    });
  };
  const editFormSubmit = (editForm) => {
  
    console.log(editForm);
    editForm.id = edit.id

    axios
      .post("http://localhost:8000/api/v1/contacts/edit-contact", editForm)
      .then((response) => {
        alert("contact edited");
        setShow(false);
        setRefresh(refresh ? false : true);
      });
  };
  function onChange(e) {
    setEditFormData({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  }
  function deleteContact(e) {
    axios
      .get("http://localhost:8000/delete/v1/contacts/delete-contact/" + edit.id)
      .then((response) => {
        setShow(false);
        setRefresh(refresh ? false : true);
        alert("deleted");
      });
  }
  useEffect(() => {
    axios.get("http://localhost:8000/api/v1/contacts").then((response) => {
      console.log(response.data);
      response.data.map(
        (data) =>
          (data.action = (
            <button
              className="rounded-pill"
              onClick={() => action(data._id, data)}
            >
              action
            </button>
          ))
      );
      setDatatable({ ...datatable, rows: response.data });
    });
  }, [refresh]);
  const openModal = () => {
    setEdit({
      ...edit,
      status: false,
    });
    setShow(true);
  };

  return (
    <div
      className="container mt-5 pt-4 pl-1"
      style={{
        background: "white",
        height: "100%",
        boxShadow: "#c3c3c3 5px 5px 5px 5px",
      }}
    >
      <div className="row">
        <div className="col-md-2">
          <Button
            variant=""
            style={{ background: "#ffc107", color: "white" }}
            onClick={openModal}
          >
            Add new
          </Button>
        </div>

        <Modal
          show={show}
          onHide={() => setShow(false)}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              {edit.status === true ? " Edit Contact" : "Add New Contact"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {edit.status === true ? (
              <Form onSubmit={handleSubmit(editFormSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    defaultValue={edit.data.name}
                    {...register("name")}
                    onChange={onChange}
                  />
                 <p className="text-danger">{errors.name?.message}</p>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    defaultValue={edit.data.email}
                    {...register("email")}
                    onChange={onChange}
                  />
                  <p className="text-danger">{errors.email?.message}</p>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Control
                    type="number"
                    placeholder="Phone"
                    name="phone"
                    defaultValue={edit.data.phone}
                    {...register("phone")}
                    onChange={onChange}
                  />
                   <p className="text-danger">{errors.phone?.message}</p>
                 
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="designation"
                    name="designation"
                    defaultValue={edit.data.designation}
                    {...register("designation")}
                    onChange={onChange}
                  />
                 <p className="text-danger">{errors.designation?.message}</p>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="date"
                    placeholder="date"
                    name="date"
                    defaultValue={edit.data.date}
                    {...register("date")}
                    onChange={onChange}
                  />
                <p className="text-danger">{errors.date?.message}</p>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Edit
                </Button>
                <Button variant="danger" onClick={deleteContact}>
                  delete
                </Button>
              </Form>
            ) : (
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    {...formik.getFieldProps("name")}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="text-danger">{formik.errors.name}</div>
                  ) : null}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-danger">{formik.errors.email}</div>
                  ) : null}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Control
                    type="number"
                    placeholder="Phone"
                    name="phone"
                    {...formik.getFieldProps("phone")}
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="text-danger">{formik.errors.phone}</div>
                  ) : null}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="designation"
                    name="designation"
                    {...formik.getFieldProps("designation")}
                  />
                  {formik.touched.designation && formik.errors.designation ? (
                    <div className="text-danger">
                      {formik.errors.designation}
                    </div>
                  ) : null}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="date"
                    placeholder="date"
                    name="date"
                    {...formik.getFieldProps("date")}
                  />
                  {formik.touched.date && formik.errors.date ? (
                    <div className="text-danger">{formik.errors.date}</div>
                  ) : null}
                </Form.Group>
                <div className="row">
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            )}
          </Modal.Body>
        </Modal>
        {/* <button onClick={() => addNewUser()}>Add</button> */}
        <MDBDataTableV5
          className="col-md-10 mb-1  "
          style={{ background: "white", marginLeft: "-3.6px" }}
          hover
          entriesOptions={[5, 20, 25]}
          entries={5}
          pagesAmount={4}
          data={datatable}
          pagingTop
          searchTop
          searchBottom={false}
          barReverse
        />
      </div>
    </div>
  );
}
