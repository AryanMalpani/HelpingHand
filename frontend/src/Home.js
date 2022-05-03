import React from "react";
import "./carousel.css";
import { Button, TextField, Link } from "@material-ui/core";
export default function Home() {
  return (
    <div>
      <nav class="navbar background">
        <ul class="nav-list">
          <div class="logo">
            <img src="https://t4.ftcdn.net/jpg/03/98/82/85/360_F_398828514_pRI8TYbmpH8uXUUwZfENHU41jp8gvFTb.jpg" />
          </div>
          <li>
            <a href="#web"> About Helping Hand</a>
          </li>
          <li>
            <a href="#program">How to Use</a>
          </li>
          <li>
            <a href="#course">Contact Us</a>
          </li>
        </ul>
      </nav>

      <section class="firstsection">
        <div class="box-main">
          <div class="firstHalf">
            <h1 class="text-big" id="web">
              Helping Hand
            </h1>

            <p class="text-small">
              Helping Hand comes to your door-step to solve a very vital problem
              in our society where many people especially in the later stages of
              their lives (old age) find it difficult to perform various
              activities and feel helpless. On the other hand, the younger
              generation is full of energy and enthusiasm and many of them are
              often looking for opportunities to do social work. Our Application
              makes it easier for both sides by connecting them to each other
              and facilitating the needs of both.
            </p>
            <br></br>
            <Button class="button">
              <Link href="/Login">Lets Get Started!</Link>
            </Button>
          </div>
        </div>
      </section>

      <section class="secondsection">
        <div class="box-main">
          <div class="secondHalf">
            <h1 class="text-big" id="program">
              Here is your Guide for Using this Application
            </h1>
            <p class="text-small">
              Our application has three kinds of users: admin , help seeker and
              volunteers. Help seekers would have to take up an annual or
              monthly subscription which would be a minimal amount just to
              maintain the balance of the app and the legitimacy of the user.
              Help seekers would be able to choose any of the services listed or
              they can even ask for any specific help. Volunteers would also
              have to register with full-proof identity and through a series of
              verification to ensure the safety and security of the process.
              Whenever any help seeker asks for any help it generates a
              notification message for the nearby volunteers.
            </p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="paras">
          <h1 class="sectionTag text-big">Contact Us</h1>

          <p class="sectionSubTag text-small">
            Phone No :0755-2626262<br></br>
            Email address : helpinghand@gmail.com<br></br>
            website :<Link href="/#program">www.helpinghand.com</Link>
            <br></br>
          </p>
        </div>
      </section>

      <footer class="background">
        <p class="text-footer">Copyright ©-All rights are reserved</p>
      </footer>
    </div>
  );
}
