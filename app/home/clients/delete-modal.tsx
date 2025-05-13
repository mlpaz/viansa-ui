"use client";
import { ModalContent, ModalHeader, ModalFooter, Modal } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Client } from "@/types";

export const DeleteModal = ({
  isOpen,
  onOpenChange,
  input,
  deleteHandler,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  input: Client;
  deleteHandler: (id: string) => void;
}) => {
  const title = input.id
    ? "Sure to delete " + input.name + " " + input.surname + " client ?"
    : "";
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop={"blur"}>
      <ModalContent className="px-2">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center text-2xl mb-1">
              {title}
            </ModalHeader>

            <ModalFooter className="flex justify-between mt-2">
              <Button
                onPress={() => {
                  deleteHandler(input.id || "");
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
