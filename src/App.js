import { useState } from "react";

export default function App() {
  const [friends, setFriends] = useState([
    {
      id: 118836,
      name: "Clark",
      image: "https://i.pravatar.cc/48?u=118836",
      balance: 0,
    },
    {
      id: 933372,
      name: "Sarah",
      image: "https://i.pravatar.cc/48?u=933372",
      balance: 20,
    },
    {
      id: 499476,
      name: "Anthony",
      image: "https://i.pravatar.cc/48?u=499476",
      balance: 0,
    },
  ]);

  return (
    <div className="App grid">
      <div className="">
        <FriendsList setFriends={setFriends} friends={friends} />
        <AddFriend friends={friends} onAddFriend={setFriends} />
      </div>
    </div>
  );
}

function FriendsList({ friends, setFriends }) {
  const [selectedId, setSelectedId] = useState("");
  const selectedFriend = friends.find((friend) => friend.id === selectedId);

  return (
    <div className="grid-2">
      <div>
        {friends.map((friend) => (
          <Friend
            friend={friend}
            selectedId={selectedId}
            onSelect={setSelectedId}
            key={friend.id}
          />
        ))}
      </div>
      <Split
        friends={friends}
        setFriends={setFriends}
        friend={selectedFriend}
      />
    </div>
  );
}

function Friend({ friend, onSelect, selectedId }) {
  let isSelected = selectedId === friend.id;

  function handleSelect(id) {
    isSelected ? onSelect(0) : onSelect(id);
  }

  return (
    <>
      <div className="grid">
        <div className="grid">
          <img src={friend.image} alt="clark" />
          <div className="w300">
            <h3>{friend.name}</h3>
            {friend.balance === 0 && <p>You and {friend.name} are even</p>}
            {friend.balance > 0 && (
              <p className="red">
                You owe {friend.name} {friend.balance}$
              </p>
            )}
            {friend.balance < 0 && (
              <p className="green">
                {friend.name} owes you {Math.abs(friend.balance)}$
              </p>
            )}
          </div>
        </div>
        <button onClick={() => handleSelect(friend.id)} className="button ">
          {isSelected ? "Choose" : "Select"}
        </button>
      </div>
    </>
  );
}

function AddFriend({ friends, onAddFriend }) {
  const [isActive, setActive] = useState(true);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  function toggleButtons() {
    setActive(!isActive);
    setName("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    name &&
      onAddFriend([...friends, { name, image, balance: 0, id: Date.now() }]);
    console.log(friends);
    toggleButtons();
    setName("");
  }

  return (
    <div style={{ display: "flex" }}>
      <div></div>
      <button
        className={`${isActive ? "" : " hidden "} button`}
        onClick={toggleButtons}
      >
        AddFriend
      </button>
      <div className={`${isActive ? "hidden" : " flex "} button`}>
        <form onSubmit={handleSubmit}>
          <label>🥰Friend name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>🎡Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <button className="button">Add</button>
        </form>

        <button className="button" onClick={toggleButtons}>
          Close
        </button>
      </div>
    </div>
  );
}

function Split({ friend, friends, setFriends }) {
  const [bill, setBill] = useState(0);
  const [myExpense, setMyExpense] = useState(0);
  const [payMan, setPayMan] = useState("me");
  const friendExpense = bill - myExpense;

  if (friend === undefined) return;

  function handleSplit(e) {
    e.preventDefault();
    console.log({ bill, myExpense, payMan });
    if (payMan === "me") {
      setFriends(
        friends.map((currentf) => {
          if (currentf.id === friend.id) {
            return { ...friend, balance: friend.balance - friendExpense };
          }
          return currentf;
        })
      );
    }
    if (payMan !== "me") {
      setFriends((friends) =>
        friends.map((currentf) => {
          if (currentf.id === friend.id) {
            return { ...friend, balance: friend.balance + friendExpense };
          }
          return currentf;
        })
      );
    }
    setBill(0);
    setMyExpense(0);
    setPayMan("me");
  }

  return (
    <>
      <div className="split">
        <h2>Split a bill with {friend.name}</h2>
        <form>
          <div style={{ display: "flex" }}>
            <h5>Bill value </h5>
            <input
              value={bill}
              type="number"
              onChange={(e) => setBill(e.target.value)}
            />
          </div>
          <div style={{ display: "flex" }}>
            <h5>Your expense </h5>
            <input
              value={myExpense}
              type="number"
              onChange={(e) => setMyExpense(e.target.value)}
            />
          </div>
          <div style={{ display: "flex" }}>
            <h5>Anthony's expense </h5>
            <input type="number" disabled value={friendExpense} />
          </div>
          <div style={{ display: "flex" }}>
            <h5>Who is paying the bill? </h5>
            <select value={payMan} onChange={(e) => setPayMan(e.target.value)}>
              <option value={"me"}>You</option>
              <option value={friend.name}>{friend.name}</option>
            </select>
          </div>
          <button onClick={handleSplit}>Split Bill</button>
        </form>
      </div>
    </>
  );
}
