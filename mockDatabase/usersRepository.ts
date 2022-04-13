import { NewUser, SensitiveInfoUser } from "types";
const fs = require("fs");

const DATABASE_PATH = "/tmp/users.json";
const DUMMY_USERS = [
  {
    id: 1,
    email: "juan@playtomic.dev",
    name: "Juan Lebrón Chincoa",
    password: "pass",
  },
  {
    id: 2,
    email: "alejandra@playtomic.dev",
    name: "Alejandra Salazar Bengoechea",
    password: "pass",
  },
];

const loadDataFromDisk = async () => {
  const data = fs.readFileSync(DATABASE_PATH, "utf-8");
  users = JSON.parse(data);
};

// users in JSON file for simplicity, store in a db for production applications
let users: SensitiveInfoUser[] = [];
try {
  if (fs.existsSync(DATABASE_PATH)) {
    loadDataFromDisk();
  } else {
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(DUMMY_USERS, null, 4));
    loadDataFromDisk();
  }
} catch (err) {
  console.error(err);
}

export const usersRepository = {
  getAll: (): SensitiveInfoUser[] => users,
  add,
  update,
  getDummyUsers: (): SensitiveInfoUser[] => DUMMY_USERS,
};

function add(newUser: NewUser): SensitiveInfoUser {
  const user: SensitiveInfoUser = {
    id: users.length ? Math.max(...users.map((x) => x.id)) + 1 : 1,
    password: "pass", // TODO add a comment
    ...newUser,
  };

  users.push(user);
  saveData();

  return user;
}

function update(sensitiveInfoUser: SensitiveInfoUser) {
  const user = users.find((x) => x.id === sensitiveInfoUser.id);
  Object.assign(user, sensitiveInfoUser);
  saveData();
}

function saveData() {
  fs.writeFileSync(DATABASE_PATH, JSON.stringify(users, null, 4));
}
