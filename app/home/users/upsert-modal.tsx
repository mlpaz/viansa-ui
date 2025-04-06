"use client";
import { ModalContent, ModalHeader, ModalFooter, Modal } from "@heroui/modal";
import { Button } from "@heroui/button";
import { UserLogin } from "@/types";
import { Input } from "@heroui/input";

export const UpsertModal = ({
  isOpen,
  onOpenChange,
  input,
  setInput,
  upsertHandler,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  input: UserLogin;
  setInput: (input: UserLogin) => void;
  upsertHandler: (input: UserLogin) => void;
}) => {
  const title = input.id ? "Edit User" : "Add User";
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop={"blur"}>
      <ModalContent className="px-2">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center text-2xl mb-1">
              {title}
            </ModalHeader>
            <section className="flex gap-4">
              <Input
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={input.email}
                onChange={(e) => setInput({ ...input, email: e.target.value })}
              />
              <Input
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={input.password}
                onChange={(e) =>
                  setInput({ ...input, password: e.target.value })
                }
              />
            </section>
            <ModalFooter className="flex justify-between mt-2">
              <Button
                onPress={() => {
                  upsertHandler(input);
                  onClose();
                }}
                color="primary"
              >
                Confirm
              </Button>

              <Button onPress={onClose}>Close</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
