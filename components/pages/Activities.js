import Image from "next/image";

function Activity() {
  return (
    <>
      <h1 className="head-text">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        <div href={`/`}>
          <article className="activity-card">
            <Image
              src={"/images/pic1.jpg"}
              alt="user_logo"
              width={20}
              height={20}
              className="rounded-full object-cover"
            />
            <p className="!text-small-regular text-light-1">
              <span className="mr-1 text-primary-500">Paul Sho</span> replied to
              your thread
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

export default Activity;
