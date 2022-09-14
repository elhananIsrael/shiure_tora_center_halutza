function About() {
  try {
    return <h1>אודות</h1>;
  } catch (error) {
    console.error("error", error);
  }
}

export default About;
