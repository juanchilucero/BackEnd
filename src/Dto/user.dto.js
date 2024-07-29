export class UserUpdateDTO {
    constructor(firstName, lastName, email, password, role, googleId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.googleId = googleId;
    }
}

export class UserCreateDTO {
    constructor(firstName, lastName, email, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}
