import React from "react";
import { connect, useSelector, useDispatch } from "react-redux";

// Actions
import { addNewCollege } from "../../../actions/admin";
import { setAlert } from "../../../actions/subAlert";

// Reusable & Config
import Controls from "../../reusable/controls/Controls";
import { useForm, Form } from "../../reusable/useForm";
import { collegeAreaOption } from "../../config/Admin";

const NewCollege = ({
  setOpenPopup,
  // Action
  addNewCollege,
  initialFValues,
}) => {
  const dispatch = useDispatch();
  const allColleges = useSelector((state) => state.admin.allColleges);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : "学校名称不能为空！！";
    if ("area" in fieldValues)
      temp.area = fieldValues.area ? "" : "所选地区不能为空！";
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  // Use Form
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  } = useForm(initialFValues, true, validate);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const processing = new Promise((resolve, reject) => {
        allColleges.forEach((item, index, array) => {
          if (item.name === values.name) resolve(false);
          if (index === array.length - 1) resolve(true);
        });
      });
      processing.then((res) => {
        if (res) {
          addNewCollege(values.name, values.area);
        } else {
          dispatch(
            setAlert(`学校：${values.name}， 已存在！新建失败！`, "warning")
          );
        }
        setOpenPopup(false);
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Controls.Input
        name="name"
        label="学校 *"
        value={values.name}
        onChange={handleInputChange}
        error={errors.name}
      />
      <Controls.Select
        name="area"
        label="地区 *"
        value={values.area}
        onChange={handleInputChange}
        options={collegeAreaOption()}
        error={errors.area}
      />
      <Controls.Button type="submit" text="添加" />
    </Form>
  );
};

export default connect(null, { addNewCollege })(NewCollege);
