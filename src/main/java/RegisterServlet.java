import com.google.gson.Gson;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.*;

@WebServlet(name = "RegisterServlet", value = "/RegisterServlet")
public class RegisterServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String credentials = br.readLine();
        Gson gson = new Gson();
        User user = gson.fromJson(credentials, User.class);
        System.out.println(user.toString());
        br.close();

        try {
            String myDriver = "com.mysql.cj.jdbc.Driver";
            Class.forName(myDriver);
            Connection conn = DriverManager.getConnection
                    ("jdbc:mysql://localhost:3306/db1", "user",
                            "20552055");
                String SQL_INSERT = "INSERT INTO db1.user_valid (login, password) VALUES (?,?)";
                PreparedStatement prst = conn.prepareStatement(SQL_INSERT);
                prst.setString(1, user.getLogin());
                prst.setString(2, user.getPassword());
                prst.execute();
                prst.close();

        } catch (SQLException | ClassNotFoundException throwables){
            response.setStatus(500);
        }

    }
}
