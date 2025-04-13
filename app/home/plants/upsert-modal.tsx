"use client";
import { ModalContent, ModalHeader, ModalFooter, Modal } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Plant } from "@/types";
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
  input: Plant;
  setInput: (input: Plant) => void;
  upsertHandler: (input: Plant) => void;
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
                label="Name"
                placeholder="Enter Plant Name"
                type="string"
                value={input.name}
                onChange={(e) => setInput({ ...input, name: e.target.value })}
              />
              <Input
                label="Type"
                placeholder="Enter Plant Type"
                type="string"
                value={input.type}
                onChange={(e) => setInput({ ...input, type: e.target.value })}
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
