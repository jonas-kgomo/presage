import { Dialog } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { MdSave } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Modal } from "../../components/Modal";
import { ModalHeader } from "../../components/ModalHeader";
import { mutator } from "../../lib/mutator";
import { Article } from "../../lib/types";

interface EditTagModalProps {
  id: string;
}

export const EditTagModal: React.FC<EditTagModalProps> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: draft } = useQuery<Article>(`/articles/draft/${id}`);
  const [tags, setTags] = useState(
    draft ? draft?.tags.map((x) => x.name).join(", ") : ""
  );
  const { mutateAsync } = useMutation(mutator);

  useEffect(() => {
    setTags(draft ? draft?.tags.map((x) => x.name).join(", ") : "");
  }, [id, draft]);

  const handleSubmit = async () => {
    const s = tags.trim();
    let tagsArray: string[];
    if (s.length > 0) {
      tagsArray = s.split(/,\s{0,}/g);
      if (tagsArray.length > 5) {
        return alert("at most 5 tags please!");
      }
    } else {
      tagsArray = [];
    }
    await mutateAsync([`/articles/tags/${id}`, { tags: tagsArray }, "patch"], {
      onSuccess: (data) => {
        queryClient.setQueryData<Article>(
          `/articles/draft/${id}`,
          (old) => ({ ...old, tags: data } as any)
        );
        setIsOpen(false);
      },
    });
    queryClient.refetchQueries("/articles/drafts");
    queryClient.refetchQueries("/articles/published");
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        type="button"
        color="transparent"
        size="none"
        noAnimate
      >
        <span className="text-gray-800">Edit Tags</span>
      </Button>
      <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <ModalHeader
          handleClose={() => setIsOpen(false)}
          button={
            <Button
              size="small"
              type="button"
              icon={<MdSave className="w-4 h-4" />}
              onClick={handleSubmit}
            >
              Save
            </Button>
          }
        />
        <div className="p-6">
          <Dialog.Title as="h4">Edit Tags</Dialog.Title>
          <p className="mt-1 text-gray-500">
            Enter a list of comma separated tags (up to 5)
          </p>
          <div className="mt-6">
            <Input
              name="tags"
              onChange={(e) => setTags(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              value={tags}
              placeholder="Movie, Review, Star Wars"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
