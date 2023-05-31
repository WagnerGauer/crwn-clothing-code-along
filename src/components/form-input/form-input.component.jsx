import { FormInputLabel, Input, Group } from "./form-input.styles";

const FormInput = ({ label, ...otherProps }) => {
   //because I have label before ...otherProps, the key value pair: label will not be inside of
   return (
      <Group className="group">
         <Input className="form-input" {...otherProps} />
         {label && (
            <FormInputLabel shrink={otherProps.value.length}>
               {label}
            </FormInputLabel>
         )}
      </Group>
   );
};

export default FormInput;
