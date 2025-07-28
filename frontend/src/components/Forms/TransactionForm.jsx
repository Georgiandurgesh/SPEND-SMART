import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { Title, Category, Add, Amount } from "../../utils/Icons";
import PropTypes from "prop-types";

const TransactionForm = ({
  categories,
  formData,
  button,
  btnColor,
  hasErrors,
  errors,
  isLoading,
  handleOnChange,
  handleDateChange,
  handleSubmit,
}) => {
  const { title, amount, description, category, date } = formData;

  return (
    <form className="w-full max-w-xl mx-auto bg-white/80 dark:bg-background/80 rounded-3xl shadow-xl p-8 flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          label="Title"
          placeholder="Enter the title"
          name="title"
          value={title}
          onChange={handleOnChange}
          isInvalid={!!errors.title}
          errorMessage={errors?.title}
          startContent={<Title />}
          className="flex-1"
        />
        <Input
          type="number"
          label="Amount"
          placeholder="Enter the amount"
          name="amount"
          value={amount}
          onChange={handleOnChange}
          isInvalid={!!errors.amount}
          errorMessage={errors?.amount}
          startContent={<Amount />}
          className="flex-1"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <Select
          name="category"
          label="Category"
          placeholder="Select the category"
          value={category}
          onChange={handleOnChange}
          isInvalid={!!errors.category}
          errorMessage={errors?.category}
          startContent={<Category />}
          className="flex-1"
        >
          {categories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </Select>
        <DatePicker
          name="date"
          label="Select the date"
          value={date}
          onChange={handleDateChange}
          isInvalid={!!errors.date}
          errorMessage={errors?.date}
          className="flex-1"
          showMonthAndYearPickers
          calendarProps={{
            nextButtonProps: {
              variant: 'light',
              color: 'primary',
            },
            prevButtonProps: {
              variant: 'light',
              color: 'primary',
            },
            yearPickerProps: {
              className: 'w-full',
            },
            monthPickerProps: {
              className: 'w-full',
            },
          }}
          topContent={
            <div className="flex justify-between items-center w-full px-2 py-1">
              <Button 
                size="sm" 
                variant="light" 
                onPress={() => {
                  const currentYear = new Date(date || new Date()).getFullYear();
                  const newDate = new Date(date || new Date());
                  newDate.setFullYear(currentYear - 1);
                  handleDateChange(newDate);
                }}
              >
                &larr; Previous Year
              </Button>
              <Button 
                size="sm" 
                variant="light" 
                onPress={() => {
                  const currentYear = new Date(date || new Date()).getFullYear();
                  const newDate = new Date(date || new Date());
                  newDate.setFullYear(currentYear + 1);
                  handleDateChange(newDate);
                }}
              >
                Next Year &rarr;
              </Button>
            </div>
          }
        />
      </div>
      <Textarea
        name="description"
        label="Description"
        placeholder="Enter your description"
        maxRows={4}
        value={description}
        onChange={handleOnChange}
        isInvalid={!!errors.description}
        errorMessage={errors?.description}
      />
      <Button
        color={btnColor}
        startContent={<Add />}
        className="w-full py-3 text-lg font-semibold rounded-full shadow-md bg-primary hover:bg-primary-600 transition-colors"
        isLoading={isLoading}
        onClick={handleSubmit}
        isDisabled={
          !title || !amount || !category || !date || !description || hasErrors
        }
      >
        {button}
      </Button>
    </form>
  );
};

TransactionForm.propTypes = {
  categories: PropTypes.array.isRequired,
  formData: PropTypes.object.isRequired,
  button: PropTypes.string,
  btnColor: PropTypes.string,
  hasErrors: PropTypes.bool,
  errors: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  handleOnChange: PropTypes.func.isRequired,
  handleDateChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default TransactionForm;
