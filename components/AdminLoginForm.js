import { loginUser } from "../pages/api/firebase.auth.functions";

import {
  Box,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  Link,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await loginUser(email, password);
      router.push("/admin/authenticated");
    } catch (error) {
      if (error.message === "Firebase: Error (auth/wrong-password).") {
        setErrorMessage("Wrong password! Please try again.");
      } else if (error.message === "Firebase: Error (auth/user-not-found).") {
        setErrorMessage(
          "Email does not exist! Please try again or please sign up."
        );
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  useEffect(() => {
    const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const isValidEmail = (email) => {
      return emailRegex.test(email);
    };

    if (!isValidEmail(email)) {
      setErrorMessage("Email is invalid. Please try again.");
    } else {
      setErrorMessage("");
    }
  }, [email]);

  useEffect(() => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+-=,./<>?;':"[\]{}|~`]).{8,}$/;

    const isStrongPassword = (password) => {
      //   return passwordRegex.test(password);
      return true;
    };

    if (!isStrongPassword(password)) {
      setErrorMessage(
        "Password must contain at least 8 characters, at least 1 digit, at least 1 uppercase letter, at least 1 lowercase letter, and at least 1 special character"
      );
    } else {
      setErrorMessage("");
    }
  }, [password]);

  return (
    <form onSubmit={handleSubmit}>
      <Box
        width="400px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </FormControl>
        <FormControl id="password" isRequired mt="10px">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </FormControl>
        {errorMessage && (
          <Box mt="10px" color="red.500" w="300px" textAlign="center">
            <Text>{errorMessage}</Text>
          </Box>
        )}
        <Button
          mt="20px"
          type="submit"
          _hover={{ color: "white", backgroundColor: "#5B8ADC" }}
          border="2px #6da9d6 solid"
          backgroundColor="#00000000"
          color="#6da9d6"
          w="100px"
        >
          Login
        </Button>
        <Box
          fontSize="20px"
          color="#6da9d6"
          textAlign="center"
          display="flex"
          mt="40px"
        >
          <Text pr="4px">Apply to be an admin </Text>
          <Link as={NextLink} id="admin-link" href="/admin">
            <Text
              fontWeight="700"
              fontSize="20px"
              _hover={{ cursor: "pointer", textDecoration: "underline" }}
            >
              here
            </Text>
          </Link>
        </Box>
      </Box>
    </form>
  );
};

export default AdminLoginForm;
