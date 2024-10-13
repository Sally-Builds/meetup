import { useNavigate } from "react-router-dom";
import { authPageConstants } from "../../constants/texts.c";
import styles from "./index.module.css";
import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { FormData, schema } from "./schema";
import { Select } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../../api/user";

const SignupPage = () => {
  const [step, setStep] = useState(0);
  const [loading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    trigger,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      occupation: "",
    },
  });

  const { mutateAsync: signupMutation } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      reset();
      navigate("/getting-started");
    },
    onError: (error) => {
      console.log(error, "from use Mutation error");
    },
    onSettled: (_) => {
      setIsLoading(false);
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    console.log(data);
    await signupMutation(data);
  };

  const nextStep = async () => {
    const isStepValid = await trigger([
      "full_name",
      "email",
      "dob",
      "username",
      "phone",
    ]);
    // if (isStepValid) setStep(1);
    if (isStepValid) {
      setValue("password", "");
      setValue("confirmPassword", "");
      setStep(1);
    }
  };

  const prevStep = () => setStep(0);

  return (
    <>
      <div className={styles["container"]}>
        <div className={styles["title"]}>
          <div>
            <button onClick={() => navigate(-1)}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          </div>
          {authPageConstants.btnGroup[0].title}
        </div>
        <div className="heading">
          Let's help you meet people with similar interests
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["form-container"]}
          autoComplete="off"
        >
          {step == 0 && (
            <>
              <div className="input-container">
                <Controller
                  name="full_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Full name *"
                      autoComplete="off"
                      color="#6c6c6c"
                      {...field}
                    />
                  )}
                />
                {errors.full_name && (
                  <p className="errMsg">{errors.full_name?.message}</p>
                )}
              </div>

              <div className="input-container">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input placeholder="Email *" color="#6c6c6c" {...field} />
                  )}
                />
                {errors.email && (
                  <p className="errMsg">{errors.email?.message}</p>
                )}
              </div>

              <div className="input-container">
                <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Date of Birth"
                      type="text"
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) =>
                        !e.target.value && (e.target.type = "text")
                      }
                      max="2004-12-31"
                    />
                  )}
                />
                {errors.dob && <p className="errMsg">{errors.dob?.message}</p>}
              </div>

              <div className="input-container">
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Username *"
                      color="#6c6c6c"
                      {...field}
                    />
                  )}
                />
                {errors.username && (
                  <p className="errMsg">{errors.username?.message}</p>
                )}
              </div>

              <div className="input-container">
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <InputGroup>
                      <InputLeftAddon>+61</InputLeftAddon>
                      <Input {...field} type="tel" placeholder="phone number" />
                    </InputGroup>
                  )}
                />
                {errors.phone && (
                  <p className="errMsg">{errors.phone?.message}</p>
                )}
              </div>
            </>
          )}

          {step == 1 && (
            <>
              <div className="input-container">
                <Controller
                  name="occupation"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Occupation *"
                      color="#6c6c6c"
                      autoComplete="false"
                      {...field}
                    />
                  )}
                />
                {errors.occupation && (
                  <p className="errMsg">{errors.occupation?.message}</p>
                )}
              </div>

              <div className="input-container">
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select placeholder="Select option" {...field}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="errMsg">{errors.gender?.message}</p>
                )}
              </div>

              <div className="input-container">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Password *"
                      type="password"
                      color="#6c6c6c"
                      {...field}
                    />
                  )}
                />
                {errors.password && (
                  <p className="errMsg">{errors.password?.message}</p>
                )}
              </div>

              <div className="input-container">
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Confirm Password *"
                      type="password"
                      color="#6c6c6c"
                      {...field}
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <p className="errMsg">{errors.confirmPassword?.message}</p>
                )}
              </div>
            </>
          )}

          <div className={styles["btn-group"]}>
            {step === 1 && (
              <button
                className={`${styles["btn"]} ${loading && styles["disabled"]}`}
                onClick={prevStep}
                disabled={loading}
              >
                Prev
              </button>
            )}
            {step === 0 ? (
              <button className={styles["btn"]} onClick={nextStep}>
                Next
              </button>
            ) : (
              <button
                className={`${styles["btn"]} ${loading && styles["disabled"]}`}
                type="submit"
              >
                {loading ? "Signing up" : "Signup"}
              </button>
            )}
          </div>
          <div className="info">
            Already have an account? <a href="/login">Login</a>{" "}
          </div>
        </form>
      </div>
    </>
  );
};

export default SignupPage;
