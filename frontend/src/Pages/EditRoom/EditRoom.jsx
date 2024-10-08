import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateRoom, reset } from "../../features/room/roomSlice";
import { useSelector, useDispatch } from "react-redux";

const EditRoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSuccess } = useSelector((state) => state.room);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    roomNumbers: "",
  });

  const { name, price, description, roomNumbers } = formData;

  useEffect(() => {
    const getRoom = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/rooms/${id}`);
        const data = await res.json();

        const { roomNumbers, ...rest } = data;
        const roomMap = roomNumbers.map((item) => item.number);
        const roomString = roomMap.join(",");
        setFormData({
          ...rest,
          roomNumbers: roomString,
        });
      } catch (error) {
        console.log(error);
      }
    };
    getRoom();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      // navigate to rooms
      dispatch(reset());
      navigate("/rooms");
    }
  }, [isSuccess]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !roomNumbers) {
      return;
    }

    const roomArray = roomNumbers.split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "")
    .map((item) => {
      return {
        number: parseInt(item),
        unavailableDates: [],
      };
    });

    const dataToSubmit = {
      name,
      price,
      description,
      roomNumbers: roomArray,
      roomId: id,
    };

    dispatch(updateRoom(dataToSubmit));
  };
  return (
    <div>
       <div className="container">
      <h1 className="heading center">Edit Room</h1>

      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Enter room name"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="price">Price</label>
            <input
              type="text"
              name="price"
              value={price}
              placeholder="Enter price"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="desc">Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              value={description}
            ></textarea>
          </div>

          <div className="input-group">
            <label htmlFor="room numbers">Room Numbers</label>
            <textarea
              name="roomNumbers"
              onChange={handleChange}
              value={roomNumbers}
              placeholder="enter room numbers seperated by commas eg: 202, 203, 204, 400"
            ></textarea>
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default EditRoom
