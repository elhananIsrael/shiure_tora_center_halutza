function About() {
  try {
    return <h1>About</h1>;
  } catch (error) {
    console.error("error", error);
  }
}

export default About;
