import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  Button,
  InputRightElement,
} from "@chakra-ui/core";
import React, { ReactElement } from "react";

interface Props {
  errors: string | undefined;
  handleChange:
    | (((event: React.FormEvent<any>) => void) &
        ((event: React.ChangeEvent<HTMLInputElement>) => void))
    | undefined;
  values: string;
  name: string;
  type: string | undefined;
}

export default function AuthInput(props: Props): ReactElement {
  const { errors, handleChange, values, name } = props;
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  let formcontrol = (
    <FormControl my="4" isRequired isInvalid={Boolean(errors)}>
      <FormLabel textTransform="capitalize" htmlFor={name}>
        {name}
      </FormLabel>
      <Input
        pr="4.5rem"
        id={name}
        name={name}
        type={name}
        placeholder={`Enter ${name}`}
        onChange={handleChange}
        value={values}
      />
      <FormErrorMessage>{errors}</FormErrorMessage>
    </FormControl>
  );

  let passwordWrap = (
    <FormControl my="4" isRequired isInvalid={Boolean(errors)}>
      <FormLabel textTransform="capitalize" htmlFor="password">
        {name.replace("_", " ")}
      </FormLabel>
      <InputGroup>
        <Input
          pr="4.5rem"
          type={show ? "text" : "password"}
          placeholder="Enter password"
          name={name}
          onChange={handleChange}
          value={values}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{errors}</FormErrorMessage>
    </FormControl>
  );
  if (name.includes("password")) {
    return passwordWrap;
  } else {
    return formcontrol;
  }
}
