import { useState } from "react";

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function AppJonas2() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((showAddFriend) => !showAddFriend);
  }

  function handleAddFriend(friend) {
    setFriends([...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    // if (selectedFriend?.id === friend.id) {
    //   setSelectedFriend(null);
    //   return;
    // }
    // setSelectedFriend(friend);

    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={() => handleShowAddFriend()}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const { name, image, balance, id } = friend;
  const isSelected = selectedFriend?.id === id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p className={balance === 0 ? "" : balance < 0 ? "red" : "green"}>
        {balance === 0
          ? `You and ${name} are even`
          : balance > 0
          ? `${name} owns you ${balance}$`
          : `You owe ${balance}$`}
      </p>
      {balance < 0 && <p className="red">{`You owe  ${balance}$`}</p>}
      {balance > 0 && <p className="green">{`${name} owns you ${balance}$`}</p>}
      {balance === 0 && <p className="">{`You and ${name} are even`}</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    console.log(newFriend);
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>😍 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label> Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const friendsExpense = bill ? bill - yourExpense : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !yourExpense) return;

    // if (whoIsPaying === "user")
    //   onSplitBill(selectedFriend.balance + friendsExpense);
    // else onSplitBill(selectedFriend.balance - friendsExpense);

    onSplitBill(whoIsPaying === "user" ? friendsExpense : -yourExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>😭 Your expense</label>
      <input
        type="text"
        value={yourExpense}
        onChange={(e) =>
          setYourExpense(
            Number(e.target.value < bill ? e.target.value : yourExpense)
          )
        }
      />

      <label>💞 {selectedFriend.name}'s expense</label>
      <input disabled type="text" value={friendsExpense} />

      <label>😍 Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Add</Button>
    </form>
  );
}

export default AppJonas2;

const initialFriends = [
  {
    id: 118836,
    name: "Arailym",
    image: "https://i.pravatar.cc/48?u-218836",
    balance: -7,
  },
  {
    id: 218836,
    name: "Erkezhan",
    image: "https://i.pravatar.cc/48?u-218846",
    balance: 20,
  },
  {
    id: 318836,
    name: "Madina",
    image: "https://i.pravatar.cc/48?u-218816",
    balance: 0,
  },
];
