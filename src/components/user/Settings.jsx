import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global';
import { SerializeForm } from '../../helpers/SerializeForm';


export const Settings = () => {

  const { auth, setAuth } = useAuth();
  const [status, setStatus] = useState("pure");
  const [message, setMessage] = useState("");

  const saveSettings = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const newUserData = SerializeForm(e.target);

    delete newUserData.file;

    const request = await fetch(Global.url + "/users/" + auth.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(newUserData),
    });

    const data = await request.json();

    if (data.status === "success") {
      setAuth(data.user);
      setStatus("success");
    }
    else {
      setStatus("failure");
      setMessage(data.message);
    }

    const fileInput = document.querySelector("#file");

    if (data.status === "success" && fileInput.files[0]) {
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);

      const requestImage = await fetch(Global.url + "/users/upload-image", {
        method: "POST",
        headers: {
          "Authorization": token
        },
        body: formData,
      });

      const dataImage = await requestImage.json();

      if (dataImage.status === "success" && dataImage.user) {
        setAuth(dataImage.user);
        setStatus("success");
      }
      else {
        setStatus("failure");
        setMessage(data.message)
      }
    }
  }

  return (
    <>
      <header className='content__header'>
        <h1 className='content__title'>Settings</h1>
      </header>

      <div className="content__posts">
        {status === "success" && <strong className='alert alert-success'>User updated successfully</strong>}
        {status === "failure" && <strong className='alert alert-danger'>{message}</strong>}

        <form className='settings-form' onSubmit={saveSettings}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" defaultValue={auth.name} />
          </div>

          <div className="form-group">
            <label htmlFor="lastname">Last Name</label>
            <input type="text" name="lastname" defaultValue={auth.lastname} />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" defaultValue={auth.username} />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" defaultValue={auth.email} />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea name="bio" defaultValue={auth.bio} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" />
          </div>

          <div className="form-group">
            <label htmlFor="file">Avatar</label>
            <div className="avatar">
              <div className="general-info__container-avatar">
                {auth.image !== "default.png" && <img src={Global.url + "/users/image/" + auth.image} className="container-avatar__img" alt="Foto de perfil" />}
                {auth.image === "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
              </div>
            </div>
            <br />
            <input type="file" name="file" id='file' />
          </div>

          <br />

          <input type="submit" value="Save changes" className='btn btn-success' />
        </form>
      </div>
    </>
  )
}
