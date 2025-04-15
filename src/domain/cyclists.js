import { randomUUID } from "node:crypto";

class Cyclists {
    #id;
    #name;
    #email;
    #password;
    #isLogued;

    constructor({ name, email, password, id = randomUUID() }) {
        this.#id = id;
        this.#name = name;
        this.#email = email;
        this.#password = password
        this.#isLogued = false;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get email() {
        return this.#email;
    }

    get password() {
        return this.#password;
    }

    get isLogued() {
        return this.#isLogued;
    }

    set isLogued(logued) {
        this.#isLogued = logued;
    }

}

export { Cyclists }