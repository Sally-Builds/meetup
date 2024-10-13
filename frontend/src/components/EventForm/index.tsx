import {
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import styles from "./index.module.css";
import CreatableSelect from "react-select/creatable";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormData, eventFormSchema } from "./schema";
import { useAppStore } from "../../store/appStore";
import { useMutation } from "@tanstack/react-query";
import { createEvent } from "../../api/event";
import { useToast } from "@chakra-ui/react";
import moment from "moment";

interface Option {
  readonly value: string;
  readonly label: string;
}

const EventForm = ({ title }: { title: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const { interests } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      attendees: 5,
      title: "",
      description: "",
      date: "",
      activities: [],
      location: "",
    },
  });

  const { mutateAsync: createEventMutation } = useMutation({
    mutationFn: createEvent,
    onSuccess: (data) => {
      reset();
      console.log(data);
      toast({
        title: "Event Created.",
        description: "Other Users will be able to see your event.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.log(error, "from use Mutation error");
    },
    onSettled: (_) => {
      setIsLoading(false);
    },
  });

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.type = "datetime-local";
  };

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  // Simulate a button click on the file input when the custom button is clicked
  const handleButtonClick = () => {
    document.getElementById("fileInput")?.click();
  };

  const submit = async (data: EventFormData) => {
    const formData = new FormData();

    formData.append("name", data.title);
    if (data.description) {
      formData.append("description", data.description);
    }
    formData.append("date", data.date);
    formData.append("location", data.location);
    formData.append("expected_attendees", `${data.attendees}`);

    data.activities.forEach((activity, index) => {
      formData.append(`activities[${index}]`, activity.value);
    });

    if (file) {
      console.log(file);
      formData.append("cover_image", file);
    }

    await createEventMutation(formData);
    // Handle form submission
  };
  return (
    <>
      <div className={styles["container"]}>
        <div className={styles["title"]}>{title}</div>
        <form className={styles["form"]} onSubmit={handleSubmit(submit)}>
          <div className="input-container">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input placeholder="Event Title *" color="#6c6c6c" {...field} />
              )}
            />
            {errors.title && <p className="errMsg">{errors.title?.message}</p>}
          </div>

          <div className="input-container">
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Input placeholder="Location *" color="#6c6c6c" {...field} />
              )}
            />
            {errors.location && (
              <p className="errMsg">{errors.location?.message}</p>
            )}
          </div>

          <div className="input-container">
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Event Date *"
                  size="md"
                  type="text"
                  onFocus={handleFocus}
                  //   onBlur={handleBlur}
                  {...field}
                  // min={moment().format("YYYY-MM-DD HH:mm:ss")}
                />
              )}
            />
            {errors.date && <p className="errMsg">{errors.date?.message}</p>}
          </div>

          <div className="input-container">
            <Controller
              name="activities"
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <CreatableSelect
                  isMulti
                  options={interests}
                  value={value}
                  onChange={(newValue) => onChange(newValue as Option[])}
                  inputRef={ref}
                  className="text-sm"
                  placeholder="Select activities or add activities for this event *"
                />
              )}
            />
            {errors.activities && (
              <p className="errMsg">{errors.activities?.message}</p>
            )}
          </div>

          <div className="input-container">
            <Controller
              name="attendees"
              control={control}
              rules={{
                required: "This field is required",
                min: { value: 3, message: "Minimum attendees is 3" },
              }}
              render={({ field: { ref, onChange, value, ...rest } }) => (
                <div className={styles["number-input-container"]}>
                  <label htmlFor="">Expected number of attendees</label>
                  <NumberInput
                    maxW={24}
                    {...rest}
                    value={value}
                    onChange={(_, valueAsNumber) => onChange(valueAsNumber)}
                    min={3}
                  >
                    <NumberInputField ref={ref} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </div>
              )}
            />
            {errors.attendees && (
              <p className="errMsg">{errors.attendees?.message}</p>
            )}
          </div>

          <div
            className={styles["image-upload-container"]}
            onClick={handleButtonClick}
          >
            <button>
              <i className="fa-solid fa-cloud-arrow-up"></i>
            </button>
            {file ? <>{file.name}</> : <div> Upload a cover image </div>}
            <input
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <div className="input-container">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  rows={4}
                  placeholder="A brief description about your event"
                />
              )}
            />
          </div>

          <button
            type="submit"
            className={`${styles["btn"]} ${
              isLoading && `${styles["disabled"]}`
            }`}
          >
            {isLoading ? "Please Wait..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EventForm;
