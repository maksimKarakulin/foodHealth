package auth

import (
	"net/http"
)

type Handler struct {
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
}

func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
}

func (h *Handler) RefreshToken(w http.ResponseWriter, r *http.Request) {
}

///need to do this also whooops!
