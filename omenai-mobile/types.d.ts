type IndividualLoginData = {
  email: string;
  password: string;
};

type IndividualRegisterData = {
  name: string,
  email: string,
  password: string,
  confirmPassword: string
}

type GallerySignupData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  location: string;
  admin: string;
  description: string;
};

type GalleryRegisterData = Omit<GallerySignupData, "confirmPassword">;

type GalleryWaitlistData = {
  name: string,
  email: string
}