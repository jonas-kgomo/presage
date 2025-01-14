import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React from "react";
import { QueryClient, useQuery } from "react-query";
import { dehydrate } from "react-query/hydration";
import { ssrFetcher } from "../../lib/fetcher";
import { Article } from "../../lib/types";
import { DashboardLayout } from "../../modules/draft/DashboardLayout";
import { DraftEditor } from "../../modules/draft/DraftEditor";
import { EditTagModal } from "../../modules/draft/EditTagModal";
import { OpenButton } from "../../modules/draft/OpenButton";
import { PublishButton } from "../../modules/draft/PublishButton";
import { SettingsModal } from "../../modules/draft/SettingsModal";

const DraftPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ draftId }) => {
  const { data: draft } = useQuery<Article>(`/articles/draft/${draftId}`);

  return (
    <DashboardLayout>
      {draft ? (
        <>
          <header className="sticky z-50 top-0 bg-white flex items-center justify-between py-4 lg:py-6 px-8">
            <div className="flex items-center space-x-5">
              <OpenButton />
              <div className="hidden sm:flex items-center space-x-3 pr-8">
                <img
                  src={draft.journal.picture}
                  className="w-6 h-6 rounded-full"
                  alt={draft.journal.name}
                />
                <h5 className="font-semibold truncate min-w-0">
                  {draft.journal.name}{" "}
                  <span className="hidden lg:inline text-gray-400 mx-1">/</span>{" "}
                  <span className="hidden lg:inline text-gray-700 font-medium">
                    {draft.title}
                  </span>
                </h5>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-10 pr-8 flex-shrink-0">
                <EditTagModal id={draft.id} />
                <SettingsModal id={draft.id} />
              </div>
              <div className="h-6 border-r border-gray-300" />
              <div className="flex items-center space-x-10 pl-8">
                <PublishButton id={draft.id} />
              </div>
            </div>
          </header>
          <main className="py-6 px-8">
            <DraftEditor id={draft.id} />
          </main>
        </>
      ) : null}
    </DashboardLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    "/journals/me",
    ssrFetcher(context.req.cookies.jid)
  );
  await queryClient.prefetchQuery("/me", ssrFetcher(context.req.cookies.jid));
  await queryClient.prefetchQuery(
    "/rewards",
    ssrFetcher(context.req.cookies.jid)
  );
  const draftId = context.query.id?.toString() || "";
  await queryClient.prefetchQuery(
    `/articles/draft/${draftId}`,
    ssrFetcher(context.req.cookies.jid)
  );

  return {
    props: {
      draftId,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default DraftPage;
