export async function getServerSideProps() {
  return {
    redirect: {
      destination: 'https://github.com/koitoror',
      permanent: false
    }
  };
}

export default function About() {
  return <div>About</div>;
}
