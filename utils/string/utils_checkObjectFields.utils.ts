interface UserData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string
}
export function areAllFieldsFilled(obj: UserData) {
    for (let key in obj) {
        if ((obj as any)[key] === "") {
            return false;
          }
    }
    return true;
  }